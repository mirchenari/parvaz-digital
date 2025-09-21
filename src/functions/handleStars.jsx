import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function handleStars(score) {
  let result = [];
  for (let i = 1; i <= 5; i++) {
    result.push(
      <div key={i} className={i <= score ? "text-yellow-500" : "text-gray-400"}>
        <FontAwesomeIcon icon={faStar} />
      </div>
    );
  }
  return <div className="flex">{result}</div>;
}
