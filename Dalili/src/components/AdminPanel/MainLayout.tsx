import React from 'react';
import Footer from './Footer';
import MainContent from './MainContent';

import { Route, Routes } from 'react-router-dom';
import { ServiceList } from './services/ServiceList';
import UpdateServices from './services/UpdateServices';
import { SocialList } from './social/SocialList';
import UpdateSocial from './social/UpdateSocial';
import { ClientList } from './clients/ClientList';
import UpdateClients from './clients/UpdateClient';
import { AboutUsList } from './aboutUs/AboutUsList';
import UpdateAboutUs from './aboutUs/UpdateAboutUs';
import { ContactUsList } from './contactUs/ContactUsList';
import { IntroductionList } from './introduction/IntroductionList';
import UpdateIntroduction from './introduction/UpdateIntroduction';
import { HowWeHelpList } from './howWeHelp/HowWeHelpList';
import UpdateHoWeHelp from './howWeHelp/UpdateHoWeHelp';
import { ShortAboutUsList } from './shortAboutUs/ShortAboutUsList';
import UpdateShortAboutUs from './shortAboutUs/UpdateShortAboutUs';
import { OurContactList } from './ourContacts/OurContactList';
import UpdateOurContact from './ourContacts/UpdateOurContact';
import RegisterUser from './RegisterUser';
import { UserList } from './user/UserList';
import { LogoList } from './logo/LogoList';
import UpdateLogo from './logo/UpdateLogo';
import UpdateHero from './hero/UpdateHero';
import { HeroList } from './hero/HeroList';
import { GoogleMapList } from './googleMap/GoogleMapList';
import UpdateGoogleMap from './googleMap/UpdateGoogleMap';
import UpdateReview from './review/UpdateReview';
import { ReviewList } from './review/ReviewList';
import UpdateFeatureImage from './featureImage/UpdateFeatureImage';
import { FeatureImageList } from './featureImage/FeatureImageList';
const MainLayout = () => {
  return (
    <>
      <div id="layoutSidenav_content">
        <MainContent />

        <Routes>
          {/* =============  Services Route ================= */}
          <Route path="/" element={<MainContent />} />
          {/* =============  Logo Route ================= */}
          <Route path="/logo" element={<LogoList />} />
          <Route path="/UpdateLogo/:id" element={<UpdateLogo />} />
          {/* =============  Hero Route ================= */}
          <Route path="/hero" element={<HeroList />} />
          <Route path="/hero/:id" element={<UpdateHero />} />
          {/* =============  Services Route ================= */}
          <Route path="/services" element={<ServiceList />} />
          <Route path="/UpdateService/:id" element={<UpdateServices />} />

           {/* =============  Google Map Route ================= */}
           <Route path="/googleMap" element={<GoogleMapList />} />
          <Route path="/googleMap/:id" element={<UpdateGoogleMap />} />

          {/* =============  Social Icon Route ================= */}
          <Route path="/socialIcon" element={<SocialList />} />
          <Route path="/socialIcon/:id" element={<UpdateSocial />} />
          {/* ============= Social Icon Route ================= */}

          {/* =============  Clients Icon Route ================= */}
          <Route path="/client" element={<ClientList />} />
          <Route path="/client/:id" element={<UpdateClients />} />
          {/* ============= Client Icon Route ================= */}

          {/* =============  About us Route ================= */}
          <Route path="/aboutUs" element={<AboutUsList />} />
          <Route path="/aboutUs/:id" element={<UpdateAboutUs />} />
          {/* ============= About us Route ================= */}

          {/* =============  Contact us Route ================= */}
          <Route path="/contactUs" element={<ContactUsList />} />
          {/* ============= Contact us Route ================= */}

          {/* =============  Introduction  Route ================= */}
          <Route path="/introduction" element={<IntroductionList />} />
          <Route path="/introduction/:id" element={<UpdateIntroduction />} />
          {/* ============= Introduction  Route ================= */}

          {/* =============  How We Help  Route ================= */}
          <Route path="/howWeHelp" element={<HowWeHelpList />} />
          <Route path="/howWeHelp/:id" element={<UpdateHoWeHelp />} />
          {/* ============= About us Route ================= */}

          {/* =============  Short About us Route ================= */}
          <Route path="/shortAboutUs" element={<ShortAboutUsList />} />
          <Route path="/shortAboutUs/:id" element={<UpdateShortAboutUs />} />
          {/* ============= Short About us Route ================= */}

          {/* =============  Short About us Route ================= */}
          <Route path="/ourContact" element={<OurContactList />} />
          <Route path="/ourContact/:id" element={<UpdateOurContact />} />
          {/* ============= Short About us Route ================= */}
          {/* =============  Short About us Route ================= */}
          <Route path="/userRegister" element={<RegisterUser />} />
          <Route path="/users" element={<UserList />} />
          {/* ============= Short About us Route ================= */}

            {/* =============  Short Review Route ================= */}
            <Route path="/review/:id" element={<UpdateReview />} />
          <Route path="/review" element={<ReviewList />} />
          {/* ============= Short Review Route ================= */}

            {/* =============  Short Review Route ================= */}
            <Route path="/UpdateFeatureImage/:id" element={<UpdateFeatureImage />} />
            <Route path="/featureImage" element={<FeatureImageList />} />
          {/* ============= Short Review Route ================= */}
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
