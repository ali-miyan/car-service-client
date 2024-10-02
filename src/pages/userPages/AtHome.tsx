import MainLayout from '../../layouts/MainLayout'
import CustomerDetails from '../../components/user/OrderManagement/AtHome'

const CustomerDetailsPage = () => {
  return (
    <MainLayout>
      <div className='bg-gray-100'>
        <CustomerDetails />
      </div>
    </MainLayout>
  )
}

export default CustomerDetailsPage