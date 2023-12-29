import Title from "antd/es/typography/Title";
import { features } from '../utils/data'
import FeatureItem from './FeatureItem'


const Features = () => {

    return (
        <div id='features' className=" container mx-auto">
            <Title level={3} className=" text-center my-10">Features</Title>
            <div className="grid grid-cols-2 gap-8 justify-center ">
                {features.map((item) => <FeatureItem key={item.name} {...item} />)}
            </div>

        </div>
    )
}

export default Features
