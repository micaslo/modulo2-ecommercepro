import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type SubmitEvent,
} from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaCheck,
  FaExternalLinkAlt,
  FaPaperPlane,
  FaRedoAlt,
  FaRobot,
  FaShoppingCart,
  FaTimes,
  FaWhatsapp,
} from "react-icons/fa";
import { formatARS } from "../../data/checkoutConfig";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";
import {
  createMessageId,
  createWelcomeMessage,
  formatTimeNow,
  generateTilliReply,
  getContextualQuickReplies,
} from "../../services/tilliEngine";
import type {
  TilliActionLink,
  TilliMessage,
  TilliProductCard,
} from "../../types/tilli";
import "./TilliBot.css";

const SESSION_STORAGE_KEY = "tilli_chat_history_v1";
const HINT_DISMISSED_KEY = "tilli_hint_dismissed_v1";

function renderFormattedText(text: string): ReactNode {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={lineIdx} className="tilli-text-line">
        {parts.map((part, partIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
          }
          return <span key={partIdx}>{part}</span>;
        })}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

function loadSavedMessages(): TilliMessage[] | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as TilliMessage[];
  } catch {
    return null;
  }
}

export default function TilliBot() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, getProductById } = useProducts();
  const { items: cartItems, totalItems, subtotal, addToCart } = useCart();

  const currentProduct = useMemo(() => {
    const match = matchPath("/product/:id", location.pathname);
    if (!match?.params.id) return null;
    return getProductById(match.params.id) ?? null;
  }, [location.pathname, getProductById]);

  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(() => {
    try {
      return sessionStorage.getItem(HINT_DISMISSED_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [messages, setMessages] = useState<TilliMessage[]>(() => {
    return loadSavedMessages() ?? [createWelcomeMessage(currentProduct)];
  });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [cartFeedback, setCartFeedback] = useState<
    Record<string, { ok: boolean; text: string }>
  >({});

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignorar si sessionStorage no está disponible
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 120);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current !== null) {
        window.clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  const dismissHint = () => {
    setShowHint(false);
    try {
      sessionStorage.setItem(HINT_DISMISSED_KEY, "1");
    } catch {
      // Ignorar
    }
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (showHint) dismissHint();
  };

  const handleReset = () => {
    if (typingTimerRef.current !== null) {
      window.clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setIsTyping(false);
    setCartFeedback({});
    setMessages([createWelcomeMessage(currentProduct)]);
  };

  const sendMessage = (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isTyping) return;

    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.sender === "user")?.text;

    const userMsg: TilliMessage = {
      id: createMessageId("user"),
      sender: "user",
      text: trimmed,
      timestamp: formatTimeNow(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    const reply = generateTilliReply(trimmed, {
      products,
      currentProduct,
      cart: {
        totalItems,
        subtotal,
        itemNames: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      },
      lastUserQuery: lastUserMessage,
    });

    typingTimerRef.current = window.setTimeout(() => {
      const botMsg: TilliMessage = {
        id: createMessageId("bot"),
        sender: "bot",
        text: reply.text,
        timestamp: formatTimeNow(),
        products: reply.products,
        comparison: reply.comparison,
        actions: reply.actions,
        quickReplies: reply.quickReplies,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      typingTimerRef.current = null;
    }, 340);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(inputValue);
  };

  const handleAddProductCard = (card: TilliProductCard) => {
    const product = getProductById(card.id);
    if (!product) return;

    const result = addToCart({
      product,
      quantity: 1,
      image: card.image,
      colorId: card.defaultColorId,
      colorLabel: card.defaultColorLabel,
      originalPrice: card.originalPrice,
      isCar: card.isCar,
    });

    if (result.ok) {
      setCartFeedback((prev) => ({
        ...prev,
        [card.id]: { ok: true, text: "Agregado" },
      }));
    } else if (result.reason === "car_limit") {
      setCartFeedback((prev) => ({
        ...prev,
        [card.id]: { ok: false, text: "Máx. 1 vehículo" },
      }));
    } else if (result.reason === "stock_limit") {
      setCartFeedback((prev) => ({
        ...prev,
        [card.id]: { ok: false, text: "Stock máximo" },
      }));
    } else {
      setCartFeedback((prev) => ({
        ...prev,
        [card.id]: { ok: false, text: "Sin stock" },
      }));
    }

    window.setTimeout(() => {
      setCartFeedback((prev) => {
        const next = { ...prev };
        delete next[card.id];
        return next;
      });
    }, 2400);
  };

  const handleActionClick = (action: TilliActionLink) => {
    if (action.kind === "route") {
      navigate(action.to);
      if (window.innerWidth <= 540) {
        setIsOpen(false);
      }
      return;
    }
    if (action.kind === "prompt") {
      sendMessage(action.to);
    }
  };

  const handleOpenProduct = (productId: string) => {
    navigate(`/product/${productId}`);
    if (window.innerWidth <= 540) {
      setIsOpen(false);
    }
  };

  const latestMessage = messages[messages.length - 1];
  const activeQuickReplies =
    !isTyping && latestMessage?.sender === "bot" && latestMessage.quickReplies?.length
      ? latestMessage.quickReplies
      : getContextualQuickReplies(currentProduct);

  return (
    <div className="tilli-root">
      {!isOpen && showHint && (
        <div className="tilli-hint" role="status">
          <button
            type="button"
            className="tilli-hint-trigger"
            onClick={handleToggle}
          >
            <span className="tilli-hint-dot" aria-hidden="true" />
            <span>¿Te ayudo? Soy Tilli</span>
          </button>
          <button
            type="button"
            className="tilli-hint-close"
            onClick={dismissHint}
            aria-label="Cerrar aviso de Tilli"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {isOpen && (
        <section
          className="tilli-panel"
          role="dialog"
          aria-label="Chat con Tilli, asistente virtual"
        >
          <header className="tilli-header">
            <div className="tilli-header-identity">
              <div className="tilli-avatar" aria-hidden="true">
                <FaRobot />
              </div>
              <div className="tilli-header-copy">
                <div className="tilli-header-title-row">
                  <h2>Tilli</h2>
                  <span className="tilli-status-badge">En línea</span>
                </div>
                <p>Asistente de compras · Detodito Market</p>
              </div>
            </div>

            <div className="tilli-header-actions">
              <button
                type="button"
                className="tilli-icon-btn"
                onClick={handleReset}
                title="Reiniciar conversación"
                aria-label="Reiniciar conversación"
              >
                <FaRedoAlt />
              </button>
              <button
                type="button"
                className="tilli-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Cerrar chat"
                aria-label="Cerrar chat"
              >
                <FaTimes />
              </button>
            </div>
          </header>

          {currentProduct && (
            <div className="tilli-context-bar">
              <span className="tilli-context-label">
                Viendo: <strong>{currentProduct.name}</strong>
              </span>
              <button
                type="button"
                className="tilli-context-btn"
                onClick={() => sendMessage("¿Cuántas cuotas tiene?")}
              >
                Cuotas
              </button>
            </div>
          )}

          <div className="tilli-messages" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`tilli-message tilli-message--${msg.sender}`}
              >
                <div className="tilli-bubble">
                  <p className="tilli-bubble-text">
                    {renderFormattedText(msg.text)}
                  </p>
                  <span className="tilli-timestamp">{msg.timestamp}</span>
                </div>

                {msg.products && msg.products.length > 0 && (
                  <div className="tilli-product-list">
                    {msg.products.map((card) => {
                      const feedback = cartFeedback[card.id];
                      return (
                        <article key={card.id} className="tilli-product-card">
                          <div className="tilli-product-thumb">
                            {card.image ? (
                              <img src={card.image} alt={card.name} loading="lazy" />
                            ) : (
                              <div className="tilli-product-placeholder">
                                {card.category.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            {card.badge && (
                              <span className="tilli-product-badge">{card.badge}</span>
                            )}
                          </div>

                          <div className="tilli-product-body">
                            <span className="tilli-product-category">
                              {card.category}
                            </span>
                            <h3 className="tilli-product-name">{card.name}</h3>
                            <div className="tilli-product-prices">
                              <strong className="tilli-product-price">
                                {formatARS(card.price)}
                              </strong>
                              {card.originalPrice &&
                                card.originalPrice > card.price && (
                                  <span className="tilli-product-old-price">
                                    {formatARS(card.originalPrice)}
                                  </span>
                                )}
                            </div>

                            <div className="tilli-product-actions">
                              <button
                                type="button"
                                className="tilli-btn-outline"
                                onClick={() => handleOpenProduct(card.id)}
                              >
                                Ver
                              </button>
                              <button
                                type="button"
                                className={`tilli-btn-solid ${
                                  feedback
                                    ? feedback.ok
                                      ? "tilli-btn-solid--ok"
                                      : "tilli-btn-solid--warn"
                                    : ""
                                }`}
                                disabled={card.stock <= 0}
                                onClick={() => handleAddProductCard(card)}
                              >
                                {feedback ? (
                                  <>
                                    {feedback.ok && <FaCheck />}
                                    <span>{feedback.text}</span>
                                  </>
                                ) : (
                                  <>
                                    <FaShoppingCart />
                                    <span>
                                      {card.stock > 0 ? "Agregar" : "Sin stock"}
                                    </span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}

                {msg.comparison && (
                  <div className="tilli-comparison">
                    <div className="tilli-comparison-head">
                      <button
                        type="button"
                        className="tilli-comp-product"
                        onClick={() =>
                          handleOpenProduct(msg.comparison!.productA.id)
                        }
                      >
                        {msg.comparison.productA.image && (
                          <img
                            src={msg.comparison.productA.image}
                            alt={msg.comparison.productA.name}
                          />
                        )}
                        <span>{msg.comparison.productA.name}</span>
                      </button>

                      <span className="tilli-comp-vs">VS</span>

                      <button
                        type="button"
                        className="tilli-comp-product"
                        onClick={() =>
                          handleOpenProduct(msg.comparison!.productB.id)
                        }
                      >
                        {msg.comparison.productB.image && (
                          <img
                            src={msg.comparison.productB.image}
                            alt={msg.comparison.productB.name}
                          />
                        )}
                        <span>{msg.comparison.productB.name}</span>
                      </button>
                    </div>

                    <div className="tilli-comparison-rows">
                      {msg.comparison.rows.map((row) => (
                        <div key={row.label} className="tilli-comp-row">
                          <span className="tilli-comp-label">{row.label}</span>
                          <div className="tilli-comp-values">
                            <span>{row.valueA}</span>
                            <span>{row.valueB}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.actions && msg.actions.length > 0 && (
                  <div className="tilli-action-list">
                    {msg.actions.map((action) =>
                      action.kind === "whatsapp" || action.kind === "external" ? (
                        <a
                          key={action.label}
                          href={action.to}
                          target="_blank"
                          rel="noreferrer"
                          className={`tilli-action-btn ${
                            action.kind === "whatsapp"
                              ? "tilli-action-btn--wsp"
                              : ""
                          }`}
                        >
                          {action.kind === "whatsapp" ? (
                            <FaWhatsapp />
                          ) : (
                            <FaExternalLinkAlt />
                          )}
                          <span>{action.label}</span>
                        </a>
                      ) : (
                        <button
                          key={action.label}
                          type="button"
                          className="tilli-action-btn"
                          onClick={() => handleActionClick(action)}
                        >
                          <span>{action.label}</span>
                          <FaArrowRight />
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="tilli-message tilli-message--bot">
                <div className="tilli-bubble tilli-bubble--typing">
                  <span className="tilli-typing-dot" />
                  <span className="tilli-typing-dot" />
                  <span className="tilli-typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="tilli-quick-replies" aria-label="Sugerencias rápidas">
            {activeQuickReplies.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="tilli-chip"
                onClick={() => sendMessage(suggestion)}
                disabled={isTyping}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form className="tilli-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="tilli-input"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Preguntale a Tilli..."
              aria-label="Escribí tu consulta para Tilli"
              maxLength={240}
            />
            <button
              type="submit"
              className="tilli-send-btn"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Enviar mensaje"
            >
              <FaPaperPlane />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={`tilli-launcher ${isOpen ? "tilli-launcher--open" : ""}`}
        onClick={handleToggle}
        aria-label={isOpen ? "Cerrar chat de Tilli" : "Abrir chat con Tilli"}
        aria-expanded={isOpen}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>
    </div>
  );
}
