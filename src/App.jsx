import { useEffect, useState } from 'react'

const MENU_URL = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef'

function Card({ food, onAddToCart }) {
  return (
    <div className="card">
      <img src={food.image} alt={food.title} />
      <h3>{food.title}</h3>
      <b>${food.price}</b>
      <button className="red" onClick={onAddToCart}>В корзину</button>
    </div>
  )
}

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [foods, setFoods] = useState([])
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])

  useEffect(() => {
    fetch(MENU_URL)
      .then((response) => response.json())
      .then((data) => {
        const meals = data.meals.map((meal) => ({
          id: meal.idMeal,
          title: meal.strMeal,
          image: meal.strMealThumb,
          price: 5 + (meal.idMeal % 11),
        }))

        setFoods(meals)
      })
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkTheme)
    return () => document.body.classList.remove('dark')
  }, [isDarkTheme])

  const filtredFoods = foods.filter((food) =>
    food.title.toLowerCase().includes(search.toLowerCase())
  )
  const cartTotal = cart.reduce((a, b) => a + b.price, 0)

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
        <b>🍔 BURGER.kg</b>
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
        <section>
          <h1>Меню</h1>
          <input
            placeholder="Поиск бургеров..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="grid">
            {filtredFoods.map((food) => (
              <Card
                key={food.id}
                food={food}
                onAddToCart={() => addToCart(food)}
              />
            ))}
          </div>
        </section>

        <section id="cart">
          <h1>Корзина</h1>
          {cart.length === 0 ? <p>Корзина пуста</p> : (
            <>
              {cart.map((food, index) => (
                <p key={`${food.id}-${index}`}>
                  {food.title} — ${food.price}{' '}
                  <button onClick={() => removeFromCart(index)}>
                    Удалить
                  </button>
                </p>
              ))}
              <h2>Итого: ${cartTotal}</h2>
              <button className="red" onClick={placeOrder}>
                Оформить заказ
              </button>
            </>
          )}
        </section>
      </main>
    </>
  )
}

export default App
