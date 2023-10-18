import React, {useEffect, useState} from 'react';
import {Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import {Link, useNavigate} from 'react-router-dom';
import './NavMenu.css';
import {logout} from "../../imports/text";

const NavMenu = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [logged, setLogged] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLogged(!!localStorage.getItem('bearer_token'));
    }, [navigate])

    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    }

    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
                    container light>
                <NavbarBrand tag={Link} to="/">Web Chat</NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="mr-2"/>
                <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
                    <ul className="navbar-nav flex-grow">
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            {logged ? <NavLink tag={Link} className="text-dark" to="/sign-in"
                                               onClick={() => logout()}>Logout</NavLink> :
                                <NavLink tag={Link} className="text-dark" to="/sign-in">Login</NavLink>}
                        </NavItem>
                    </ul>
                </Collapse>
            </Navbar>
        </header>
    );
}

export default NavMenu;
