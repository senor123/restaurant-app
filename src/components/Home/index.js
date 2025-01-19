import {useEffect, useState} from 'react'
import './index.css'

const Home = () => {
  const [meals, setMeals] = useState([])
  const [category, setCategory] = useState('Salads and Soup')
  const [cart, setCart] = useState([])
  useEffect(() => {
    const fetchMeals = async () => {
      const response = await fetch(
        'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details',
      )

      if (!response.ok) {
        return
      }
      const resData = await response.json()
      console.log(resData)
      setMeals(resData)
    }

    fetchMeals()
  }, [])

  const filteredMeals =
    meals.length > 0
      ? meals[0].table_menu_list.filter(meal => meal.menu_category === category)
      : []
  const handleCategory = categoryItem => {
    setCategory(categoryItem)
  }
  const updateCart = ({option, dish}) => {
    if (option === 'increase') {
      const elementIndex = cart.findIndex(ele => ele.dish_id === dish.dish_id)
      if (elementIndex === -1) {
        setCart(prevCart => [...prevCart, {...dish, quantity: 1}])
      } else {
        const tempCart = [...cart]
        const element = tempCart.find(ele => ele.dish_id === dish.dish_id)

        const resultCart = tempCart.map(ele => {
          if (ele.dish_id === element.dish_id) {
            return {...element, quantity: element.quantity + 1}
          }
          return {...ele}
        })
        setCart([...resultCart])
      }
    }

    if (option === 'decrease') {
      const tempCart = [...cart]
      const element = tempCart.find(ele => ele.dish_id === dish.dish_id)
      if (element === undefined) {
        return
      }
      if (element.quantity === 1) {
        const resultCart = tempCart.filter(ele => ele.dish_id !== dish.dish_id)
        setCart(resultCart)
      } else {
        const elementIndex = tempCart.indexOf(
          ele => ele.dish_id === dish.dish_id,
        )
        tempCart.splice(elementIndex, 1, {
          ...element,
          quantity: element.quantity - 1,
        })
        setCart(tempCart)
      }
    }
  }

  const getItemQuantity = id => {
    const element = cart.find(ele => ele.dish_id === id)

    if (element === undefined) {
      return 0
    }
    return element.quantity
  }

  const getTotalQuantity = () => {
    const totalQuantity = cart.reduce((acc, sum) => acc + sum.quantity, 0)
    return totalQuantity
  }

  console.log(meals)
  return (
    <div>
      {meals.length > 0 && (
        <>
          <nav className="header">
            <h1>{meals[0].restaurant_name}</h1>

            <div>
              <span className="cartquantity">{getTotalQuantity()}</span>
              <img
                src="https://res.cloudinary.com/dee8unwh3/image/upload/v1737253444/icons8-cart-50_g9jtqe.png"
                alt="cart"
                className="cartimage"
              />
            </div>
          </nav>
          <ul className="categorylist">
            {meals[0].table_menu_list.map(meal => (
              <button
                type="button"
                onClick={() => handleCategory(meal.menu_category)}
              >
                {meal.menu_category}
              </button>
            ))}
          </ul>

          {filteredMeals && (
            <div className="mealsection">
              {filteredMeals[0].category_dishes.map(dish => (
                <div className="meal">
                  <div>
                    <h1 className="mealtitle">{dish.dish_name}</h1>
                    <p>
                      {dish.dish_currency} {dish.dish_price}
                    </p>
                    <p>{dish.dish_description}</p>
                    {dish.dish_Availability && (
                      <div className="itemquantity">
                        <button
                          type="button"
                          onClick={() => updateCart({option: 'decrease', dish})}
                        >
                          -
                        </button>
                        <span>{getItemQuantity(dish.dish_id)}</span>
                        <button
                          type="button"
                          onClick={() => updateCart({option: 'increase', dish})}
                        >
                          +
                        </button>
                      </div>
                    )}

                    {!dish.dish_Availability && (
                      <>
                        <p>Not Available</p>
                      </>
                    )}
                    {dish.addonCat.length > 0 && (
                      <p>Customizations Available</p>
                    )}
                  </div>
                  <p className="dishcalories">{dish.dish_calories} calories</p>
                  <img src={dish.dish_image} alt={dish.dish_name} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Home
