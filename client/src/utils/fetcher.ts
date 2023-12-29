import Axios from './Axios';

const fetcher = (url: string) => Axios.get(url).then((res) => res.data);

export default fetcher;
