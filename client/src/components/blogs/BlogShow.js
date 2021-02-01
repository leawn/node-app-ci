import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBlog } from '../../actions';

class BlogShow extends Component {
  componentDidMount() {
    this.props.fetchBlog(this.props.match.params._id);
  }

  renderImage() {
    if (this.props.blog.imageUrl) {
      return <img src={`https://leawn-node-app-ci-bucket.s3.eu-central-1.amazonaws.com/${this.props.blog.imageUrl}`} alt='test'/>
      // better to use CloudFront CDN from Amazon aws to prevent from exposing such details on our ecosystem.
      // so there we can create a policy access for cdn and then get the images straight from CloudFront.
      // we could actually store such a pre-pend link somewhere in config file and then render images by
      // calling something like `${config.cdn-prepend-link}/${this.props.blog.imageUrl}`
    }
  }

  render() {
    if (!this.props.blog) {
      return '';
    }

    const { title, content } = this.props.blog;

    return (
      <div>
        <h3>{title}</h3>
        <p>{content}</p>
        {this.renderImage()}
      </div>
    );
  }
}

function mapStateToProps({ blogs }, ownProps) {
  return { blog: blogs[ownProps.match.params._id] };
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow);
