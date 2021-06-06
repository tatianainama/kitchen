import { FC } from 'react';
import styles from './typography.module.css';

type SubtitleProps = {
  alternative?: boolean,
};

export const Subtitle: FC<SubtitleProps> = ({ alternative, children }) => (
  <h6 className={alternative ? styles.subtitleAlt : styles.subtitle}>{children}</h6>
)
