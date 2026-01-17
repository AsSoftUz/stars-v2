import './loaderSt.scss';

const LoaderSt = () => {
    return (
      <div className="setting-loading">
        <svg class="pl" viewBox="0 0 160 160" width="160px" height="160px" xmlns="http://www.w3.org/2000/svg">

          <g class="pl__ring-rotate">
            <circle class="pl__ring-stroke" cx="80" cy="80" r="72" fill="none" stroke="hsl(223,90%,55%)" stroke-width="16" stroke-dasharray="452.39 452.39" stroke-dashoffset="452" stroke-linecap="round" transform="rotate(-45,80,80)"></circle>
          </g>
        </svg>
      </div>
    );
};

export default LoaderSt;