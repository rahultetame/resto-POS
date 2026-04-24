import { Tab, Tabs, type TabsProps } from '@mui/material';
import cls from './CustomTabs.module.scss';

type TabItem = {
  label: string;
  value: string;
};

type CustomTabsProps = Omit<TabsProps, 'onChange'> & {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
};

const CustomTabs = ({ items, value, onChange, ...props }: CustomTabsProps) => (
  <Tabs className={cls.tabs} value={value} onChange={(_, nextValue: string) => onChange(nextValue)} {...props}>
    {items.map((item) => (
      <Tab key={item.value} label={item.label} value={item.value} />
    ))}
  </Tabs>
);

export default CustomTabs;
