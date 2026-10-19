import { useEffect, useState } from 'react'

const foods = [
  {
    id: 1,
    image: 'samosa.jpg',
    category: 'Самса',
    title: 'Самса с говядиной',
    description: 'Сочная говядина, лук и ароматные специи в хрустящем тесте.',
    price: 120,
  },
  {
    id: 2,
    image: 'samosa.jpg',
    category: 'Самса',
    title: 'Самса с курицей',
    description: 'Нежная курица с луком в тонком слоёном тесте.',
    price: 100,
  },
  {
    id: 3,
    image: 'pizza.jpg',
    category: 'Пицца',
    title: 'Пицца «Маргарита»',
    description: 'Томатный соус, тянущаяся моцарелла и ароматный базилик.',
    price: 450,
  },
  {
    id: 4,
    image: 'pizza.jpg',
    category: 'Пицца',
    title: 'Пицца «Пепперони»',
    description: 'Пикантная пепперони, моцарелла и фирменный томатный соус.',
    price: 550,
  },
  {
    id: 5,
    image: 'sushi.jpg',
    category: 'Суши',
    title: 'Ролл «Филадельфия»',
    description: 'Лосось, сливочный сыр и нежный рис.',
    price: 420,
  },
  {
    id: 6,
    image: 'sushi.jpg',
    category: 'Суши',
    title: 'Ролл «Калифорния»',
    description: 'Краб, огурец, авокадо и рис в кунжуте.',
    price: 380,
  },
  {
    id: 7,
    image: 'wings.jpg',
    category: 'Крылышки',
    title: 'Крылышки BBQ',
    description: 'Запечённые куриные крылышки в сладком соусе барбекю.',
    price: 350,
  },
  {
    id: 8,
    image: 'wings.jpg',
    category: 'Крылышки',
    title: 'Острые крылышки',
    description: 'Румяные крылышки с пряной острой глазурью.',
    price: 350,
  },
  {
    id: 9,
    image: 'burger.jpg',
    category: 'Бургеры',
    title: 'Классический бургер',
    description: 'Говяжья котлета, свежие овощи, сыр и фирменный соус.',
    price: 320,
  },
  {
    id: 10,
    image: 'burger.jpg',
    category: 'Бургеры',
    title: 'Чизбургер',
    description: 'Сочная котлета из говядины, расплавленный сыр и соус.',
    price: 350,
  },
  {
    id: 11,
    image: 'fries.jpg',
    category: 'Закуски',
    title: 'Картофель фри',
    description: 'Золотистый хрустящий картофель с щепоткой соли.',
    price: 150,
  },
  {
    id: 12,
    image: 'salad.jpg',
    category: 'Салаты',
    title: 'Свежий овощной салат',
    description: 'Сочные сезонные овощи и лёгкая заправка.',
    price: 220,
  },
]

const foodCategories = ['Все', ...new Set(foods.map((food) => food.category))]

const benefits = [
  {
    icon: '🥬',
    title: 'Свежие ингредиенты',
    description: 'Подбираем продукты, чтобы каждое блюдо было свежим и вкусным.',
  },
  {
    icon: '👨‍🍳',
    title: 'Готовим с душой',
    description: 'Готовим блюда по заказу и уделяем внимание каждой порции.',
  },
  {
    icon: '🍽️',
    title: 'Меню на любой вкус',
    description: 'Самса, пицца, суши, бургеры и другие любимые блюда в одном меню.',
  },
]

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="section-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  )
}

function InfoCard({ icon, title, description }) {
  return (
    <article className="info-card">
      <span className="info-icon" aria-hidden="true">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

function CategoryFilters({ selectedCategory, onSelectCategory }) {
  return (
    <div className="category-filters" role="group" aria-label="Категории меню">
      {foodCategories.map((category) => (
        <button
          aria-pressed={selectedCategory === category}
          className={`category-chip${selectedCategory === category ? ' active' : ''}`}
          key={category}
          onClick={() => onSelectCategory(category)}
          type="button"
        >
          {category}
        </button>
      ))}
    </div>
  )
}

function FAQItem({ question, children }) {
  return (
    <details className="faq-item">
      <summary>{question}</summary>
      <p>{children}</p>
    </details>
  )
}

function Card({ food, onAddToCart }) {
  return (
    <div className="card">
      <img
        className="food-image"
        src={`${import.meta.env.BASE_URL}images/${food.image}`}
        alt={food.title}
        loading="lazy"
        decoding="async"
      />
      <p className="food-category">{food.category}</p>
      <h3>{food.title}</h3>
      <p className="food-description">{food.description}</p>
      <b>{food.price} сом</b>
      <button className="red" onClick={onAddToCart}>Добавить в корзину</button>
    </div>
  )
}

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [cart, setCart] = useState([])

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkTheme)
    return () => document.body.classList.remove('dark')
  }, [isDarkTheme])

  const filteredFoods = foods.filter((food) =>
    (selectedCategory === 'Все' || food.category === selectedCategory)
    && `${food.title} ${food.category} ${food.description}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  )
  const cartTotal = cart.reduce((total, food) => total + food.price, 0)

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
    window.alert('Заказ оформлен!')
  }

  function scrollToCart() {
    document.getElementById('cart')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header>
        <a className="brand" href="#home">🍔 Burger House</a>
        <nav className="site-nav" aria-label="Основная навигация">
          <a href="#about">О нас</a>
          <a href="#benefits">Преимущества</a>
          <a href="#menu">Меню</a>
          <a href="#questions">Вопросы</a>
          <a href="#contacts">Контакты</a>
        </nav>
        <div className="header-actions">
          <button
            onClick={() => setIsDarkTheme((currentTheme) => !currentTheme)}
            aria-label={isDarkTheme ? 'Светлая тема' : 'Чёрная тема'}
          >
            {isDarkTheme ? '☀️ Светлая тема' : '🌙 Чёрная тема'}
          </button>
          <button onClick={scrollToCart}>
            🛒 Корзина ({cart.length})
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <p className="eyebrow">Burger House · Ош</p>
          <h1>Любимая еда — в одном месте</h1>
          <p>
            Сочная самса, горячая пицца, свежие суши и бургеры — выбирайте, что
            хочется сегодня, а мы приготовим с заботой о вкусе.
          </p>
          <a className="button-link red" href="#menu">Выбрать блюдо</a>
        </section>

        <section className="about-section" id="about">
          <div className="about-mark" aria-hidden="true">🍔</div>
          <div>
            <SectionHeading eyebrow="Добро пожаловать в Burger House" title="О нас" />
            <p className="placeholder-copy">
              Burger House — место для тех, кто любит вкусно и сытно поесть.
              Мы собрали в меню популярные блюда на каждый день: от домашней
              самсы и хрустящих крылышек до пиццы, суши и сочных бургеров.
              Выбирайте любимое, собирайте заказ и устраивайте себе вкусный
              перерыв!
            </p>
          </div>
        </section>

        <section id="benefits">
          <SectionHeading
            eyebrow="Почему выбирают нас"
            title="Вкусно, сытно, по-домашнему"
          >
            В Burger House найдётся что-то подходящее для любого настроения и
            компании.
          </SectionHeading>
          <div className="info-grid">
            {benefits.map((benefit) => (
              <InfoCard key={benefit.title} {...benefit} />
            ))}
          </div>
        </section>

        <section id="menu">
          <SectionHeading eyebrow="Всегда есть из чего выбрать" title="Наше меню">
            Самса, пицца, суши, крылышки и другие любимые блюда. Цены указаны в
            сомах.
          </SectionHeading>
          <input
            aria-label="Найти блюдо в меню"
            className="search-input"
            placeholder="Найти блюдо..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <CategoryFilters
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <div className="grid">
            {filteredFoods.map((food) => (
              <Card
                key={food.id}
                food={food}
                onAddToCart={() => addToCart(food)}
              />
            ))}
          </div>
          {filteredFoods.length === 0 && (
            <p className="empty-search">По вашему запросу ничего не найдено.</p>
          )}
        </section>

        <section className="cart-section" id="cart">
          <SectionHeading eyebrow="Ваш выбор" title="Корзина" />
          {cart.length === 0 ? <p>Корзина пуста</p> : (
            <>
              {cart.map((food, index) => (
                <p className="cart-item" key={`${food.id}-${index}`}>
                  <span>{food.title} — {food.price} сом</span>
                  <button onClick={() => removeFromCart(index)}>
                    Удалить
                  </button>
                </p>
              ))}
              <h3>Итого: {cartTotal} сом</h3>
              <button className="red" onClick={placeOrder}>
                Оформить заказ
              </button>
            </>
          )}
        </section>

        <section className="faq-section" id="questions">
          <SectionHeading eyebrow="Подсказки" title="Частые вопросы" />
          <div className="faq-list">
            <FAQItem question="Как быстро найти нужное блюдо?">
              Введите название или ингредиент в строку поиска либо выберите
              категорию над меню.
            </FAQItem>
            <FAQItem question="Как посмотреть сумму заказа?">
              Добавьте блюда в корзину — там отображаются выбранные позиции и
              общая сумма в сомах.
            </FAQItem>
            <FAQItem question="Можно добавить несколько блюд?">
              Да. Нажимайте «Добавить в корзину» у каждого блюда, которое
              хотите выбрать.
            </FAQItem>
          </div>
        </section>

        <section className="contact-section" id="contacts">
          <SectionHeading eyebrow="Заглядывайте к нам" title="Контакты">
            Будем рады приготовить для вас что-нибудь вкусное.
          </SectionHeading>
          <div className="contact-details">
            <p><strong>Адрес:</strong> Кыргызстан, город Ош</p>
            <p><strong>Меню:</strong> Самса, пицца, суши, бургеры и многое другое</p>
            <p><strong>Заказ:</strong><a href="https://t.me/kaitoppe">Тыкни</a></p>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand" href="#home">🍔 Burger House</a>
        <span>Вкусное настроение каждый день · Ош, Кыргызстан</span>
      </footer>
    </>
  )
}

export default App
