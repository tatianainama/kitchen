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
const API: string = process.env.REACT_APP_API || '';

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
}

function CBKCard({onClick, img, title, summary, actions, icons, noMedia = false, className = ''}: CBKCardProps){
  
  return(
    <Card outlined className={`cbk-card ${className}`}>
      <CardPrimaryContent onClick={onClick}>
        { noMedia ? null : <CardMedia square imageUrl={ img ? `/public/${img}` : sample_img}></CardMedia>}
        <div className='cbk-card__main'>
          <h6 className='cbk-card__main__title'>{title}</h6>
          {
            summary ? 
              <p className='cbk-card__main__summary'>{summary}</p> :
              null
          }
        </div>
      </CardPrimaryContent>
      {
        actions ?
        (
          <CardActions>
            <CardActionButtons>
              {
                actions.map(({label, handler}, i) => (
                  <Button key={i} onClick={handler}>
                    {label}
                  </Button>
                )) 
              }
            </CardActionButtons>
            {
              icons ? (
                <CardActionIcons>
                  {
                    icons.map((action, i) => (
                      <Button
                        icon={action.icon}
                        onClick={action.handler}
                        key={i}
                      />
                    ))
                  }
                </CardActionIcons>
              ) : null
            }
          </CardActions>
        ) :
        null
      }
    </Card>
  )
}

export default CBKCard;