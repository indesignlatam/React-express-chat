import './styles/main.less';
import 'sweetalert2/dist/sweetalert2.css';
import 'babel-polyfill' ;
import React from 'react';
import { render } from 'react-dom';

import HomeLikeChat from './ui/HomeLikeChat.js';

render(<HomeLikeChat/>, document.getElementById('root'));
