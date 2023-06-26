import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainLayout from './MainLayout';
import { baseUrl } from '../Constaints/baseUrl';

type Role = 'admin' | 'user' | '';

type Menu = {
  name: string;
  path: string;
  roles: Role[];
  icon: string;
};

const menus: Menu[] = [
  { name: 'Dashboard', path: '/', roles: ['admin', 'user'], icon: 'clinic-medical' },
  { name: 'Logo', path: '/logo', roles: ['admin', 'user'], icon: 'address-card' },
  { name: 'Hero', path: '/hero', roles: ['admin', 'user'], icon: 'address-card' },
  { name: 'Features', path: '/howWeHelp', roles: ['admin', 'user'], icon: 'hands-helping' },
  { name: 'Feature Image', path: '/featureImage', roles: ['admin', 'user'], icon: 'icons' },
  { name: 'Services', path: '/services', roles: ['admin', 'user'], icon: 'stream' },
  { name: 'Gallery', path: '/shortAboutUs', roles: ['admin', 'user'], icon: 'file-alt' },
  { name: 'Testinmonial', path: '/review', roles: ['admin', 'user'], icon: 'icons' },
  { name: 'Google Map', path: '/googleMap', roles: ['admin', 'user'], icon: 'info-circle' },
  { name: 'Contact', path: '/ourContact', roles: ['admin', 'user'], icon: 'address-card' },
  { name: 'Social Icon', path: '/socialIcon', roles: ['admin', 'user'], icon: 'icons' },
  { name: 'Register User', path: '/users', roles: ['admin'], icon: 'user-plus' },
];

const LeftSideBar = () => {
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRoles = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get<{ roles: Role[] }>(baseUrl + '/roles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserRoles(response.data.roles);
      } catch (err) {
        console.error(err);
        navigate('/login');
      }
    };
    fetchUserRoles();
  }, []);

  const filteredMenus = menus.filter((menu) => menu.roles.some((role) => userRoles.includes(role)));

  return (
    <>
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                {filteredMenus.map((menu) => (
                  <Link to={menu.path} className="nav-link" key={menu.path}>
                    <div className="sb-nav-link-icon">
                      <i className={`fas fa-${menu.icon}`}></i>
                    </div>
                    {menu.name}
                  </Link>
                ))}
              </div>
            </div>
            {/* <div className="sb-sidenav-footer">
              <div className="small">Logged in as: </div>
              Start Bootstrap
            </div> */}
          </nav>
        </div>
        <MainLayout />
      </div>
    </>
  );
};

export default LeftSideBar;
