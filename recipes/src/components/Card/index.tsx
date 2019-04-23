import React from 'react';
import Card, {
  CardActions,
  CardActionButtons,
  CardActionIcons,
  CardPrimaryContent,
  CardMedia,
} from "@material/react-card";
import Button from "@material/react-button";

import '@material/react-card/dist/card.min.css';
import '@material/react-button/dist/button.min.css';
import './styles.scss';
import sample_img from "./sample.png";
import IRecipe from 'types/recipes';
import { ReactNodeArray } from 'react';

type CBKCardProps = {
  withImg?: boolean,
  withActions?: boolean,
  title: string,
  summary?: string,
  img?: string,
  actions?: {
    label: string,
    handler: (event: React.MouseEvent) => void,
  }[],
  recipe?: any,
  onClick: (event: React.MouseEvent) => void,
}
  
function CBKCard(props: CBKCardProps){
  const {onClick, img, title, summary, actions} = props;
  return(
    <Card outlined className='cbk-card'>
      <CardPrimaryContent onClick={onClick}>
        <CardMedia square imageUrl={props.img || sample_img}></CardMedia>
        <div className='cbk-card__main'>
          <h6 className='cbk-card__main__title'>{props.title}</h6>
          {
            summary ? 
              <div className='cbk-card__main__summary'>{summary}</div> :
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
          </CardActions>
        ) :
        null
      }
    </Card>
  )
}

export default CBKCard;