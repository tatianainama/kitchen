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

const not_found = "https://www.archgard.com/assets/upload_fallbacks/image_not_found-54bf2d65c203b1e48fea1951497d4f689907afe3037d02a02dcde5775746765c.png";
type CBKCardProps = {
  children?: ReactNodeArray,
  title: string,
  img?: string,
}
  
function _Card(props: CBKCardProps){
  return(
    <Card outlined className='cbk-card'>
      <CardMedia imageUrl={props.img || sample_img}></CardMedia>
      <CardPrimaryContent>
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