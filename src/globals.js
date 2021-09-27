import PubSub from 'pubsub-js';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';
import Loading from '%/Loading.js'
// import styles from '!/assets/styles.css';

//window.React = React;
//window.ReactDOM = ReactDOM;
global.React = React;
global.ReactDOM = ReactDOM;
global.ReactHtmlParser = ReactHtmlParser;
global.styled = styled;

// global.styles = styles;

global.Loading = Loading;

// global.couchDB = {
//   url: "https://127.0.0.2:6984",
//   db: "test0"
// };
