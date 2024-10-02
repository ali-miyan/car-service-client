import MainLayout from '../../layouts/MainLayout'
import Checkout from '../../components/user/OrderManagement/Checkout'

const CheckoutPage = () => {
  return (
    <MainLayout>
      <div className='bg-gray-100'>
        <Checkout />
      </div>
    </MainLayout>
  )
}

export default CheckoutPage