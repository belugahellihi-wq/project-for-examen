import { useEffect, useState } from 'react'
import {
  benefits,
  categoryTranslations,
  foodCategories,
  foods,
} from './data/menu'
import { translations } from './data/translations'

const FAVORITES_STORAGE_KEY = 'burger-house-favorites'

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="section-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  )
}

function FoodCard({ food, language, isFavorite, text, onFavorite, onAdd }) {
  const title = language === 'en' ? food.titleEn : food.title
  const category = language === 'en'
    ? categoryTranslations[food.category]
    : food.category
  const description = language === 'en'
    ? food.descriptionEn
    : food.description

  return (
    <article className="card">
      <button
        aria-label={isFavorite ? text.removeFavorite : text.addFavorite}
        aria-pressed={isFavorite}
        className={`favorite-button${isFavorite ? ' active' : ''}`}
        onClick={onFavorite}
        type="button"
      >
        {isFavorite ? '♥' : '♡'}
      </button>
      <img
        className="food-image"
        src={`${import.meta.env.BASE_URL}images/${food.image}`}
        alt={title}
        loading="lazy"
        decoding="async"
      />
      <p className="food-category">{category}</p>
      <h3>{title}</h3>
      <p className="food-description">{description}</p>
      <b>{food.price} {text.currency}</b>
      <button className="red" onClick={onAdd} type="button">
        {text.addToCart}
      </button>
    </article>
  )
}

function FoodGrid({ items, language, favoriteIds, text, onFavorite, onAdd }) {
  return (
    <div className="grid">
      {items.map((food) => (
        <FoodCard
          key={food.id}
          food={food}
          language={language}
          isFavorite={favoriteIds.includes(food.id)}
          text={text}
          onFavorite={() => onFavorite(food.id)}
          onAdd={() => onAdd(food)}
        />
      ))}
    </div>
  )
}

function readFavoriteIds() {
  const savedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
  if (!savedFavorites) return []

  let favoriteIds
  try {
    favoriteIds = JSON.parse(savedFavorites)
  } catch {
    window.localStorage.removeItem(FAVORITES_STORAGE_KEY)
    return []
  }

  if (!Array.isArray(favoriteIds)) {
    window.localStorage.removeItem(FAVORITES_STORAGE_KEY)
    return []
  }

  return favoriteIds.filter((id) =>
    Number.isInteger(id) && foods.some((food) => food.id === id)
  )
}

function App() {
  const [language, setLanguage] = useState('ru')
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [cart, setCart] = useState([])
  const [favoriteIds, setFavoriteIds] = useState(readFavoriteIds)
  const text = translations[language]

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkTheme)
    return () => document.body.classList.remove('dark')
  }, [isDarkTheme])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favoriteIds)
    )
  }, [favoriteIds])

  const searchTerm = search.trim().toLowerCase()
  const visibleFoods = foods.filter((food) => {
    const matchesCategory = selectedCategory === 'Все'
      || food.category === selectedCategory
    const searchableText = [
      food.title,
      food.titleEn,
      food.category,
      categoryTranslations[food.category],
      food.description,
      food.descriptionEn,
    ].join(' ').toLowerCase()

    return matchesCategory && searchableText.includes(searchTerm)
  })

  const favoriteFoods = foods.filter((food) => favoriteIds.includes(food.id))
  const cartTotal = cart.reduce((total, food) => total + food.price, 0)

  function toggleFavorite(foodId) {
    setFavoriteIds((currentIds) => (
      currentIds.includes(foodId)
        ? currentIds.filter((id) => id !== foodId)
        : [...currentIds, foodId]
    ))
  }

  function addToCart(food) {
    setCart((currentCart) => [...currentCart, food])
  }

  function removeFromCart(indexToRemove) {
    setCart((currentCart) =>
      currentCart.filter((_, index) => index !== indexToRemove)
    )
  }

  function placeOrder() {
    setCart([])
    window.alert(text.orderPlaced)
  }

  return (
    <>
      <header>
        <a className="brand" href="#home">🍔 Burger House</a>
        <nav className="site-nav" aria-label={text.navLabel}>
          <a href="#about">{text.about}</a>
          <a href="#benefits">{text.benefits}</a>
          <a href="#menu">{text.menu}</a>
          <a href="#favorites">{text.favorites}</a>
          <a href="#questions">{text.questions}</a>
          <a href="#contacts">{text.contacts}</a>
        </nav>
        <div className="header-actions">
          <button
            aria-label={text.languageLabel}
            onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
            type="button"
          >
            {text.language}
          </button>
          <button
            aria-label={isDarkTheme ? text.lightTheme : text.darkTheme}
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            type="button"
          >
            {isDarkTheme ? `☀️ ${text.lightTheme}` : `🌙 ${text.darkTheme}`}
          </button>
          <button
            onClick={() => document.getElementById('cart')?.scrollIntoView({
              behavior: 'smooth',
            })}
            type="button"
          >
            🛒 {text.cart} ({cart.length})
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <p className="eyebrow">Burger House · Ош</p>
          <h1>{text.heroTitle}</h1>
          <p>{text.heroDescription}</p>
          <a className="button-link red" href="#menu">{text.chooseDish}</a>
        </section>

        <section className="about-section" id="about">
          <div className="about-mark" aria-hidden="true">🍔</div>
          <div>
            <SectionHeading eyebrow={text.welcome} title={text.aboutTitle} />
            <p className="placeholder-copy">{text.aboutDescription}</p>
          </div>
        </section>

        <section id="benefits">
          <SectionHeading eyebrow={text.whyUs} title={text.benefitsTitle}>
            {text.benefitsDescription}
          </SectionHeading>
          <div className="info-grid">
            {benefits.map((benefit) => (
              <article className="info-card" key={benefit.title}>
                <span className="info-icon" aria-hidden="true">
                  {benefit.icon}
                </span>
                <h3>
                  {language === 'en' ? benefit.titleEn : benefit.title}
                </h3>
                <p>
                  {language === 'en'
                    ? benefit.descriptionEn
                    : benefit.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="menu">
          <SectionHeading eyebrow={text.menuEyebrow} title={text.menuTitle}>
            {text.menuDescription}
          </SectionHeading>
          <input
            aria-label={text.searchLabel}
            className="search-input"
            placeholder={text.searchPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div
            className="category-filters"
            role="group"
            aria-label={text.categoryLabel}
          >
            {foodCategories.map((category) => (
              <button
                aria-pressed={selectedCategory === category}
                className={`category-chip${selectedCategory === category ? ' active' : ''}`}
                key={category}
                onClick={() => setSelectedCategory(category)}
                type="button"
              >
                {language === 'en'
                  ? categoryTranslations[category]
                  : category}
              </button>
            ))}
          </div>
          {visibleFoods.length > 0 ? (
            <FoodGrid
              items={visibleFoods}
              language={language}
              favoriteIds={favoriteIds}
              text={text}
              onFavorite={toggleFavorite}
              onAdd={addToCart}
            />
          ) : (
            <p className="empty-search">{text.noSearchResults}</p>
          )}
        </section>

        <section id="favorites">
          <SectionHeading
            eyebrow={text.favoriteEyebrow}
            title={text.favoritesTitle}
          />
          {favoriteFoods.length > 0 ? (
            <FoodGrid
              items={favoriteFoods}
              language={language}
              favoriteIds={favoriteIds}
              text={text}
              onFavorite={toggleFavorite}
              onAdd={addToCart}
            />
          ) : (
            <p className="empty-search">{text.noFavorites}</p>
          )}
        </section>

        <section className="cart-section" id="cart">
          <SectionHeading eyebrow={text.yourChoice} title={text.cart} />
          {cart.length === 0 ? <p>{text.cartEmpty}</p> : (
            <>
              {cart.map((food, index) => (
                <p className="cart-item" key={`${food.id}-${index}`}>
                  <span>
                    {language === 'en' ? food.titleEn : food.title}
                    {' — '}
                    {food.price} {text.currency}
                  </span>
                  <button
                    onClick={() => removeFromCart(index)}
                    type="button"
                  >
                    {text.remove}
                  </button>
                </p>
              ))}
              <h3>{text.total}: {cartTotal} {text.currency}</h3>
              <button className="red" onClick={placeOrder} type="button">
                {text.checkout}
              </button>
            </>
          )}
        </section>

        <section id="questions">
          <SectionHeading eyebrow={text.hints} title={text.faqTitle} />
          <div className="faq-list">
            {[
              [text.faqSearchQuestion, text.faqSearchAnswer],
              [text.faqCartQuestion, text.faqCartAnswer],
              [text.faqMultipleQuestion, text.faqMultipleAnswer],
            ].map(([question, answer]) => (
              <details className="faq-item" key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contacts">
          <SectionHeading eyebrow={text.visitUs} title={text.contactsTitle}>
            {text.contactsDescription}
          </SectionHeading>
          <div className="contact-details">
            <p><strong>{text.address}:</strong> {text.location}</p>
            <p><strong>{text.menu}:</strong> {text.contactMenu}</p>
            <p>
              <strong>{text.order}:</strong>{' '}
              <a id="tg" href="https://t.me/kaitoppe">{text.contactLink}</a>
            </p>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand" href="#home">🍔 Burger House</a>
        <span>{text.footer}</span>
      </footer>
    </>
  )
}

export default App
