import { FC } from 'react';
import Link from 'next/link';

const main = [['Home', '/']];

const secondary = [
  ['Recipes', '/recipes'],
  ['Planner', '/'],
  ['Cart', '/']
];

const Navbar: FC = () => (
  <nav className="h-16 text-white bg-black">
    <div className="flex justify-between layout-container items-center h-full">
      <ul className="flex">
        {main.map(([label, href]) => (
          <li key={label}>
            <Link href={href}>
              <a className="text-btn block leading-10 px-4 hover:text-grey-200">
                {label}
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="hidden sm:flex">
        {secondary.map(([label, href]) => (
          <li key={label}>
            <Link href={href}>
              <a className="text-btn block leading-10 px-4 hover:text-grey-200">
                {label}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </nav>
);

export default Navbar;
