'use client'; // required if you're using Next.js App Router

import "./card.list.container.css";
import Card from "./Card";
import { useRouter } from "next/navigation";

const CardList = ({ listcomponent }) => {
  const router = useRouter();

  const handleClick = (id) => {
    router.push(`/messages/${id}`);
  };

  return (
    <div className="card-list">
      {listcomponent.map((monster) => (
        <div key={monster.id} onClick={() => handleClick(monster.id)} className="cursor-pointer">
          <Card monster={monster} />
        </div>
      ))}
    </div>
  );
};

export default CardList;
