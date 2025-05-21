// CardList.jsx
import './card.list.container.css';
import Card from './Card';

const CardList = ({ listcomponent }) => (
  <div className="card-list">
    {listcomponent.map((monster) => (
      <Card key={monster.id} monster={monster} />
    ))}
  </div>
);

export default CardList;
