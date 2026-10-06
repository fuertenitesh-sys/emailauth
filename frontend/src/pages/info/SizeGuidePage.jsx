import React, { useEffect } from 'react';
import './InfoPages.css';

const SizeGuidePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="info-page-container">
      <div className="info-content-wrapper">
        <h1 className="info-title">Size Guide</h1>
        <p className="info-subtitle">Use our sizing charts below to find your perfect fit.</p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Men's Footwear</h2>
        <div className="size-table-container">
          <table className="size-table">
            <thead>
              <tr>
                <th>US Size</th>
                <th>UK Size</th>
                <th>EU Size</th>
                <th>Length (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>7</td><td>6</td><td>40</td><td>25.4</td></tr>
              <tr><td>8</td><td>7</td><td>41</td><td>26.2</td></tr>
              <tr><td>9</td><td>8</td><td>42</td><td>27.1</td></tr>
              <tr><td>10</td><td>9</td><td>43</td><td>27.9</td></tr>
              <tr><td>11</td><td>10</td><td>44</td><td>28.8</td></tr>
              <tr><td>12</td><td>11</td><td>45</td><td>29.6</td></tr>
            </tbody>
          </table>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Women's Footwear</h2>
        <div className="size-table-container">
          <table className="size-table">
            <thead>
              <tr>
                <th>US Size</th>
                <th>UK Size</th>
                <th>EU Size</th>
                <th>Length (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>5</td><td>3</td><td>35</td><td>22.0</td></tr>
              <tr><td>6</td><td>4</td><td>36</td><td>22.9</td></tr>
              <tr><td>7</td><td>5</td><td>37</td><td>23.7</td></tr>
              <tr><td>8</td><td>6</td><td>38</td><td>24.6</td></tr>
              <tr><td>9</td><td>7</td><td>39</td><td>25.4</td></tr>
              <tr><td>10</td><td>8</td><td>40</td><td>26.2</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;
