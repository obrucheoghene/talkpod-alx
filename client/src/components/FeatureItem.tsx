import { FeaturesType } from "../utils/types"

const FeatureItem:React.FC<FeaturesType> = ({name, description, iconClass}) => {
  return (
    <div className="feature-wrapper ">
    <i className={iconClass}></i>

    <div className="features-content">
      <h3>{name}</h3>
      <p>
       {description}
      </p>
    </div>
  </div>
  )
}

export default FeatureItem
