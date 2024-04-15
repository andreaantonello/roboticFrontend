import React from 'react';

const Box = ({ title, jointNumber, isConnected, position, velocity, current }) => {
    // Determine the color of the status indicator (red for 'error', green for 'ok')
    const statusColor = isConnected ? 'green' : 'red';
    const indicatorClasses = `status-indicator ${isConnected ? 'ok' : ''}`;

    return (
        <div className="box">
            <div className="box-header">
                <div className="box-title">Joint {jointNumber}</div>
                {/* Apply indicatorClasses to set color based on isConnected */}
                <div className={indicatorClasses} style={{ backgroundColor: statusColor }} />
            </div>
            <div className="textbox">
                <label htmlFor={`${title}-position`} className="label-right">Position:</label>
                <input type="text" id={`${title}-position`} value={position} className="value-left" readOnly />
            </div>
            <div className="textbox">
                <label htmlFor={`${title}-velocity`} className="label-right">Velocity:</label>
                <input type="text" id={`${title}-velocity`} value={velocity} className="value-left" readOnly />
            </div>
            <div className="textbox">
                <label htmlFor={`${title}-current`} className="label-right">Current Value:</label>
                <input type="text" id={`${title}-current`} value={current} className="value-left" readOnly />
            </div>
        </div>
    );
};

export default Box;
