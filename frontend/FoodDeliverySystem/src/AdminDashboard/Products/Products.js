import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Modal,
  Button,
  Collapse,
  Form,
} from 'react-bootstrap';

const API_BASE_URL = 'http://localhost:3005';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState([]);
  const [productData, setProductData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products`);
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = (product) => {
    setProductData(product);
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE_URL}/products/${productData._id}`, productData);
      const updated = products.map((p) =>
        p._id === productData._id ? productData : p
      );
      setProducts(updated);
      handleCloseEditModal();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleRowToggle = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const maxPerPage = 5;
  const totalPages = Math.ceil(filteredProducts.length / maxPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * maxPerPage,
    page * maxPerPage
  );

  if (loading) return <div className='text-center text-warning'>Loading...</div>;

  return (
    <div className='container my-5'>
      <div className='row mb-3'>
        <div className='col-md-8'>
          <h2 className='fw-bold text-warning'>🍔 Food Items List</h2>
        </div>
        <div className='col-md-4'>
          <input
            type='text'
            className='form-control border-warning'
            placeholder='Search food items...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className='table-responsive shadow p-3 rounded' style={{ backgroundColor: '#000' }}>
        <table className='table table-dark table-hover align-middle'>
          <thead className='table-warning'>
            <tr>
              <th>Expand</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price ($)</th>
              <th className='text-end'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <React.Fragment key={product._id}>
                <tr>
                  <td>
                    <button
                      className='btn btn-sm btn-outline-warning'
                      onClick={() => handleRowToggle(product._id)}
                    >
                      {expandedRows.includes(product._id) ? '-' : '+'}
                    </button>
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td className='text-end'>
                    <i
                      className='fas fa-edit text-warning me-3 cursor-pointer'
                      onClick={() => handleShowEditModal(product)}
                    ></i>
                    <i
                      className='fas fa-trash text-warning cursor-pointer'
                      onClick={() => handleDelete(product._id)}
                    ></i>
                  </td>
                </tr>
                <tr>
                  <td colSpan={5}>
                    <Collapse in={expandedRows.includes(product._id)}>
                      <div className='p-3 bg-dark text-white'>
                        <p><strong>Description:</strong> {product.description}</p>
                        {product.image && (
                          <img
                            src={`${API_BASE_URL}/${product.image.replace(/\\/g, '/')}`}
                            alt={product.name}
                            className='img-fluid rounded'
                            style={{ maxWidth: '200px' }}
                          />
                        )}
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className='d-flex justify-content-between align-items-center mt-3'>
          <Button
            variant='warning'
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>
          <span className='text-warning'>
            Page {page} of {totalPages}
          </span>
          <Button
            variant='warning'
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton className='bg-dark text-warning'>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-black text-light'>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                name='name'
                value={productData.name || ''}
                onChange={handleInputChange}
                className='bg-dark text-white border-warning'
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                name='category'
                value={productData.category || ''}
                onChange={handleInputChange}
                className='bg-dark text-white border-warning'
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                name='price'
                value={productData.price || ''}
                onChange={handleInputChange}
                className='bg-dark text-white border-warning'
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as='textarea'
                name='description'
                value={productData.description || ''}
                onChange={handleInputChange}
                className='bg-dark text-white border-warning'
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className='bg-dark'>
          <Button variant='secondary' onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant='warning' onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}