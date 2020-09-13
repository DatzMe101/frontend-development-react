import React, { Component } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import CreateProduct from './CreateProduct';

const stateClearData = {
  id: 0,
  productName: '',
  category: '',
  description: '',
  price: '',
};

const productMapper = (product) => {
  return {
    id: product._id,
    productName: product.name,
    category: product.category.name,
    description: '',
    price: product.price,
  };
};

class App extends Component {
  state = {
    products: [
      {
        id: 1,
        productName: 'Logi Mouse',
        category: 'Technology',
        description: 'This is a mouse from Logi',
        price: 560,
      },
      {
        id: 2,
        productName: 'Generic keyboard',
        category: 'Technology',
        description: 'Generic keyboard',
        price: 470,
      },
    ],
    form: {
      id: 0,
      productName: '',
      category: '',
      description: '',
      price: '',
    },
  };

  async componentDidMount() {
    const { data } = await axios.get('http://localhost:3001/api/products');
    this.setState({ products: data.map(productMapper) });
  }

  onUpdateProduct() {
    const { products: previousProducts, form } = this.state;
    const products = previousProducts.map((product) => {
      if (product.id === form.id) {
        product.productName = form.productName;
        product.category = form.category;
        product.description = form.description;
        product.price = form.price;
      }
      return product;
    });
    this.setState({ products, form: { ...stateClearData } });
  }

  onCreateProduct() {
    const { products, form } = this.state;
    if (form.id) {
      this.onUpdateProduct();
      return;
    }
    const productId = products.length
      ? products[products.length - 1].id + 1
      : 1;
    form.id = productId;
    this.setState({
      products: [...products, form],
      form: { ...stateClearData },
    });
  }

  onDeleteProduct(productId) {
    const { products: previousProducts } = this.state;
    const products = previousProducts.filter(
      (product) => product.id !== productId
    );
    this.setState({ products });
  }

  onInputChange(event) {
    const form = { ...this.state.form };
    form[event.currentTarget.name] = event.currentTarget.value;
    this.setState({ form });
  }

  onSelectProduct(product) {
    debugger;
    this.setState({ form: { ...product } });
  }

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-4'>
            <CreateProduct
              product={this.state.form}
              onCreateProduct={(product) => this.onCreateProduct(product)}
              onInputChange={(event) => this.onInputChange(event)}
            />
          </div>
          <div className='col-md-8'>
            <ProductList
              products={this.state.products}
              onDelete={(productId) => this.onDeleteProduct(productId)}
              onSelect={(product) => this.onSelectProduct(product)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
