import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div>
        <a
          href="mailto:captain_beaty@gmail.com"
          style={styles.link}
          title="Envoyer un email"
        >
          <i className="fas fa-envelope" style={styles.icon}></i>
        </a>
      </div>
      <p style={styles.text}>Developed by CaptainBeaty</p>
    </footer>
  );
};

const styles = {
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#007bff',
    color: 'white',
    position: 'relative',
    bottom: 0,
    width: '100%',
    textAlign: 'center',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    fontSize: '20px',
    marginBottom: '10px',
  },
  icon: {
    fontSize: '24px',
  },
  text: {
    fontSize: '14px',
    margin: 0,
  },
};

export default Footer;
