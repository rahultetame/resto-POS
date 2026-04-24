import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import { Chip, IconButton } from '@mui/material';
import CustomTabs from '../../components/slider/CustomTabs';
import { CustomButton } from '../../components/form';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { addItem, clearCart, removeItem, updateItem } from '../../store/slices/cartSlice';
import { useState } from 'react';
import cls from './OrderScreen.module.scss';

const menu = [
  { id: '1', name: 'Smoked Paneer Bowl', price: 14, category: 'Mains' },
  { id: '2', name: 'Crispy Chicken Bao', price: 12, category: 'Starters' },
  { id: '3', name: 'Truffle Fries', price: 8, category: 'Starters' },
  { id: '4', name: 'Garden Citrus Salad', price: 11, category: 'Salads' },
  { id: '5', name: 'Cold Brew Tonic', price: 6, category: 'Drinks' },
  { id: '6', name: 'Mango Cheesecake', price: 9, category: 'Desserts' },
];

const categories = ['All', ...Array.from(new Set(menu.map((item) => item.category)))];

const OrderScreen = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const [category, setCategory] = useState('All');
  const filteredMenu = category === 'All' ? menu : menu.filter((item) => item.category === category);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Order Screen</h1>
          <p className="page__subtitle">Quick-add menu grid with an always-visible cart for fast checkout.</p>
        </div>
      </div>
      <div className={cls.pos}>
        <div className={cls.pos__menu}>
          <CustomTabs items={categories.map((item) => ({ label: item, value: item }))} value={category} onChange={setCategory} />
          <div className={cls.pos__grid}>
            {filteredMenu.map((product) => (
              <article className={cls.product} key={product.id}>
                <div className={cls.product__top}>
                  <div>
                    <h2 className={cls.product__name}>{product.name}</h2>
                    <span className={cls.product__category}>{product.category}</span>
                  </div>
                  <Chip label={`$${product.price}`} size="small" />
                </div>
                <CustomButton onClick={() => dispatch(addItem(product))} startIcon={<AddIcon />}>
                  Add
                </CustomButton>
              </article>
            ))}
          </div>
        </div>
        <aside className={cls.cart}>
          <div className={cls.cart__header}>
            <h2 className={cls.cart__title}>Current Order</h2>
            <CustomButton color="inherit" disabled={!items.length} onClick={() => dispatch(clearCart())} size="small" variant="outlined">
              Clear
            </CustomButton>
          </div>
          <div className={cls.cart__items}>
            {items.length ? (
              items.map((item) => (
                <div className={cls.cart__item} key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <div>${item.price.toFixed(2)}</div>
                  </div>
                  <div className={cls.cart__controls}>
                    <IconButton aria-label="Decrease quantity" size="small" onClick={() => dispatch(updateItem({ id: item.id, quantity: item.quantity - 1 }))}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <strong>{item.quantity}</strong>
                    <IconButton aria-label="Increase quantity" size="small" onClick={() => dispatch(updateItem({ id: item.id, quantity: item.quantity + 1 }))}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="Remove item" color="error" size="small" onClick={() => dispatch(removeItem(item.id))}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              ))
            ) : (
              <p>No items added yet.</p>
            )}
          </div>
          <div className={cls.cart__total}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <CustomButton disabled={!items.length}>Send to Kitchen</CustomButton>
        </aside>
      </div>
    </section>
  );
};

export default OrderScreen;
