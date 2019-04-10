import React from 'react';
import Card, {
  CardActions,
  CardActionButtons,
  CardActionIcons
} from "@material/react-card";

import '@material/react-card/dist/card.min.css';

function RCard(){
  return(
    <Card>
      <h1>Title</h1>
      <CardActions>
        <CardActionButtons>
          <button>Click Me</button>
        </CardActionButtons>

        <CardActionIcons>
          <i>Click Me Too!</i>
        </CardActionIcons>
      </CardActions>
    </Card>
  )
}

export default RCard;