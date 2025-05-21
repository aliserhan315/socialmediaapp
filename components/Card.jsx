import Image from 'next/image';
import './card.list.container.css';

const Card = ({ monster }) => {
  const { first_name, last_name, image_url } = monster;

  return (
    <div className="cardcontainer">
      <Image
        alt={`${first_name} ${last_name}`}
        src={image_url}
        width={100}
        height={100}
        style={{
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: "10px",
        }}
      />
      <h2>{first_name} {last_name}</h2>
    </div>
  );
};

export default Card;
