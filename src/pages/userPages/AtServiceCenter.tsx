import MainLayout from '../../layouts/MainLayout'
import AtServiceCenter from '../../components/user/OrderManagement/AtServiceCenter'

const AtServiceCenterPage = () => {
  return (
    <MainLayout>
      <div className='bg-gray-100'>
        <AtServiceCenter />
      </div>
    </MainLayout>
  )
}

export default AtServiceCenterPage