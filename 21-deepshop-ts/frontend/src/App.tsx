import F1Inline from './components/F1Inline';
import F2LocalFn from './components/F2LocalFn';
import F3ModuleFn from './components/F3ModuleFn';
import F4ClassMethod from './components/F4ClassMethod';
import F5Hook from './components/F5Hook';
import F6WrapperDynamic from './components/F6WrapperDynamic';
import F7BeLocalFn from './components/F7BeLocalFn';
import F8BeModuleFn from './components/F8BeModuleFn';
import F9BeClassMethod from './components/F9BeClassMethod';
import ProductList from './components/ProductList';
import OrderPanel from './components/OrderPanel';

export default function App() {
  return (
    <div>
      <h1>DeepShop — dispatch rung matrix</h1>
      <F1Inline />
      <F2LocalFn />
      <F3ModuleFn />
      <F4ClassMethod />
      <F5Hook />
      <F6WrapperDynamic />
      <F7BeLocalFn />
      <F8BeModuleFn />
      <F9BeClassMethod />
      <ProductList />
      <OrderPanel />
    </div>
  );
}
