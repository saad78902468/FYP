import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const CheckoutPage = () => {
    const [house_no, setHouseNo] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [postcode, setPostcode] = useState('');
    const [instructions, setInstructions] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('FoodCustomerToken');
            if (!token) return alert('User token not found');

            const decoded = jwtDecode(token);
            const user_id = decoded?.id;

            const payload = {
                user_id,
                house_no,
                street,
                city,
                postcode,
                instructions
            };

            const res = await axios.post('http://localhost:3005/address/add-address', payload);

            const address_id = res.data._id || 'dummy_id';
            navigate(`/completeorder?user_id=${user_id}&address_id=${address_id}`);
        } catch (error) {
            console.error('Error submitting address:', error);
            alert('Failed to submit address. Please try again.');
        }
    };

    return (
        <Container className="p-5">
            <Row className="justify-content-center">
                <Col md={8} className="bg-white shadow rounded-lg p-4">
                    <h5 className="text-danger mb-4">Delivery Address</h5>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>House No</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter house number"
                                value={house_no}
                                onChange={(e) => setHouseNo(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Street</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter street"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Postcode</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter postcode"
                                value={postcode}
                                onChange={(e) => setPostcode(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Instructions for Delivery Boy</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter instructions"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                            />
                        </Form.Group>

                        <Button type="submit" variant="danger" className="w-100">
                            Submit Address
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default CheckoutPage;