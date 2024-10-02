import MapBoxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useControl } from 'react-map-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useLocation } from '../../context/MapContext';

const Geocoder = () => {

  const { setLatitude, setLongitude,setAddress } = useLocation();

  const ctrl:any = new MapBoxGeocoder({
    accessToken: "pk.eyJ1IjoiYWxpbWl5biIsImEiOiJjbHk2d2Y4MGowZGl1MnZyMWoyZzl1MWE2In0.--JAm0FRN6RoZuoIHsldUA",
    marker: false,
    collapsed: true,
  });
  useControl(() => ctrl);
  ctrl.on('result', (e:any) => {
    const {center,place_name} = e.result;
    console.log(e.result,'centererer',place_name);
    setLatitude(center[1])
    setLongitude(center[0])
    setAddress(place_name.split(','))
    
  });
  return null;
};

export default Geocoder;