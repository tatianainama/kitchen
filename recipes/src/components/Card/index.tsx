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
import { ReactNodeArray } from 'react';
import sample_img from "./sample.png";

type fc = (recipe: any) => undefined;

type CBKCardProps = {
  children?: ReactNodeArray,
  title: string,
  img?: string,
  recipe?: any,
  onClick: fc,
}
  
function _Card(props: CBKCardProps){
  return(
    <Card outlined className='cbk-card'>
      <CardMedia imageUrl={props.img || sample_img}></CardMedia>
      <CardPrimaryContent onClick={props.onClick}>
        <h6>{props.title}</h6>
      </CardPrimaryContent>
      <CardActions>
        <CardActionButtons>
          <Button>Edit</Button>
          <Button>shopping</Button>
          <Button>delete</Button>
        </CardActionButtons>
      </CardActions>
    </Card>
  )
}

export default _Card;