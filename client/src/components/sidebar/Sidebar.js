import React from "react";
import { Link } from "react-router-dom";
import '../../styles/styleSidebar.css';
import '../../styles/styleGeneral.css';


export default function Sidebar(props) {

  let {links,url} = props;
  return(
     <div className="sidebar-left">
           <ul className="container-column-list">
                   {links.map((link)=>(
                       <li className="item-column-list wrap">
                           <Link key={link.id} to={`${url}${link.path}`}>
                               <img className={"img-icon"} src={link.icon}/>
                               {link.name}
                           </Link>
                       </li>
                   ))}
           </ul>
     </div>
 ); 
}