import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import axios from "axios";
import { useToast } from "../../ToastManager";

export default function AddProducts() {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
    inStock: true,
  });

  const handleInputChange = (e) => {
    const { name, type, checked, files, value } = e.target;
    let finalValue;

    if (type === "checkbox") {
      finalValue = checked;
    } else if (type === "file") {
      finalValue = files[0]; // actual file
    } else {
      finalValue = value;
    }

    setProductData({ ...productData, [name]: finalValue });
  };



  const showToast = useToast();

  const handleSuccess = () => {
    showToast("Success", "Product added successfully!", "success");
  };

  const handleError = () => {
    showToast("Error", "Something went wrong!", "danger");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("description", productData.description);
    formData.append("inStock", productData.inStock);
    formData.append("image", productData.image); // important: actual file

    try {
      const response = await axios.post("http://localhost:3005/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      handleSuccess();
      setProductData({
        name: "",
        price: "",
        category: "",
        description: "",
        image: "",
        inStock: true,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      handleError();
    }
  };



  // const categories = ["Pizza", "Burgers", "Pasta", "BBQ", "Drinks"];
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3005/category')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);
  return (
    <div className="container py-5 px-0">
      <div className="rounded shadow-lg p-4 mt-3 bg-black">
        <h4 className="text-start text-yellow-500 fw-bold mb-3">Add New Product</h4>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="name">
                <Form.Label className="fw-semibold">Product Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text><i className="fas fa-box"></i></InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    name="name"
                    value={productData.name}
                    onChange={handleInputChange}
                    requiyellow
                    className="shadow-sm"
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="price">
                <Form.Label className="fw-semibold">Price</Form.Label>
                <InputGroup>
                  <InputGroup.Text><i className="fas fa-dollar-sign"></i></InputGroup.Text>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    name="price"
                    value={productData.price}
                    onChange={handleInputChange}
                    requiyellow
                    className="shadow-sm"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="category">
                <Form.Label className="fw-semibold">Category</Form.Label>
                <InputGroup>
                  <InputGroup.Text><i className="fas fa-tags"></i></InputGroup.Text>
                  <Form.Select
                    name="category"
                    value={productData.category}
                    onChange={handleInputChange}
                    requiyellow
                    className="shadow-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat.name}>{cat.name}</option>
                    ))}

                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="image">
                <Form.Label className="fw-semibold">Image URL</Form.Label>
                <InputGroup>
                  <InputGroup.Text><i className="fas fa-image"></i></InputGroup.Text>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="shadow-sm"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="description">
                <Form.Label className="fw-semibold">Description</Form.Label>
                <InputGroup>
                  <InputGroup.Text><i className="fas fa-info-circle"></i></InputGroup.Text>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter description"
                    name="description"
                    value={productData.description}
                    onChange={handleInputChange}
                    className="shadow-sm"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="inStock">
                <Form.Check
                  type="checkbox"
                  label="In Stock"
                  name="inStock"
                  checked={productData.inStock}
                  onChange={handleInputChange}
                  className="fw-semibold text-yellow-400"
                />
              </Form.Group>
            </Col>
          </Row>

          <Button
            type="submit"
            className="btn bg-yellow-500 btn-lg rounded shadow-lg border-0 mt-3 hover:bg-yellow-900"
          >
            <i className="fas fa-plus-circle me-2"></i>Add Product
          </Button>
        </Form>
      </div>
    </div>
  );
}