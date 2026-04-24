import { CustomButton } from '../../components/form';
import cls from './KioskScreen.module.scss';

const combos = [
  { name: 'Chef Signature Meal', price: '$24', copy: 'Main, side, dessert, and a chilled drink.' },
  { name: 'Quick Lunch Set', price: '$16', copy: 'Built for speed with no compromise on flavor.' },
  { name: 'Family Table Pack', price: '$58', copy: 'Shareable plates for four with house beverages.' },
];

const KioskScreen = () => (
  <section className={cls['kiosk-page']}>
    <div className={cls['kiosk-page__hero']}>
      <h1 className={cls['kiosk-page__title']}>Order at your pace</h1>
      <p className={cls['kiosk-page__copy']}>Browse popular combinations and send your order straight to the counter.</p>
    </div>
    <div className={cls['kiosk-page__grid']}>
      {combos.map((combo) => (
        <article className={cls['kiosk-card']} key={combo.name}>
          <h2 className={cls['kiosk-card__title']}>{combo.name}</h2>
          <p>{combo.copy}</p>
          <span className={cls['kiosk-card__price']}>{combo.price}</span>
          <CustomButton>Start Order</CustomButton>
        </article>
      ))}
    </div>
  </section>
);

export default KioskScreen;
