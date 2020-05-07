import React from 'react';
import Card, {
  CardActions,
  CardActionButtons,
  CardPrimaryContent,
  CardMedia,
  CardActionIcons
} from "@material/react-card";
import Button from "components/Button";
import '@material/react-card/dist/card.min.css';
import '@material/react-button/dist/button.min.css';

import './styles.scss';
import sample_img from "./sample.png";
const API: string = process.env.REACT_APP_IMG || '';

type CBKCardProps = {
  withImg?: boolean,
  title: string,
  summary?: string,
  img?: string,
  noMedia?: boolean,
  actions?: {
    label: string,
    handler: (event: React.MouseEvent) => void,
  }[],
  icons?: {
    icon: string,
    handler: (event: React.MouseEvent) => void
  }[],
  onClick: (event: React.MouseEvent) => void,
  className?: string,
  highlight?: boolean,
}

const CBKCard: React.FunctionComponent<CBKCardProps> = ({ title, summary, img, icons, actions, onClick, highlight }) => {
  return (
    <div className={`cbk-card ${highlight ? 'cbk-card--highlight' : ''}`}>
      <div className="cbk-card__header" onClick={onClick}>
        <div className="cbk-card__header__media" style={{backgroundImage: `url(${img ? `${API}/${img}` : sample_img})`}}></div>
        <div className="cbk-card__header__main">
          <div className="cbk-card__header__main__title" title={title}>
            <h6>{title}</h6>
          </div>
          <div className="cbk-card__header__main__subtitle">
            <p>{summary}</p>
          </div>
        </div>
      </div>
      {
        actions && (
          <div className="cbk-card__actions">
            <div className="cbk-card__actions__buttons">
              { actions.map((action, i) => (
                <Button key={i} onClick={action.handler}>{action.label}</Button>
              ))}
            </div>
            <div className="cbk-card__actions__icons">
              { icons && icons.map((icon, index) => (
                <Button
                  icon={icon.icon}
                  onClick={icon.handler}
                  key={index}
                />
              )) }
            </div>
          </div>
        )
      }
    </div>
  )
}

export default CBKCard;