import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import Clock from './features/Clock';

import './App.css';

const App = () => {
  return (
    <div className="App">
      <Container>
        <Row>
          <Col sm={6}>
            <Clock />
          </Col>
          <Col sm={6}>
            <Clock />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
