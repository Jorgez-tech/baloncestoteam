import React, { useEffect, useState } from 'react';
import client from '../api/client';

export default function Gallery() {
  const [imgs, setImgs] = useState([]);

  useEffect(() => {
    client.get('/images?limit=10').then(res => setImgs(res.data.data));
  }, []);

  return (
    <div className="gallery">
      {imgs.map(i=>(
        <figure key={i._id}>
          <img src={i.url} alt={i.leyenda}/>
          {i.leyenda && <figcaption>{i.leyenda}</figcaption>}
        </figure>
      ))}
    </div>
  );
}