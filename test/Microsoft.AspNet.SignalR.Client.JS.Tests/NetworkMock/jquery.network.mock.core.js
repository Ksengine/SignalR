﻿/// <reference path="jquery.network.mock.ajax.js" />
/// <reference path="jquery.network.mock.eventsource.js" />
/// <reference path="jquery.network.mock.mask.js" />
/// <reference path="jquery.network.mock.websocket.js" />

// Network core
(function ($, window) {
    var invoke = function (methodName) { // Invoke the method with the name methodName on all mocks
        var args = Array.prototype.slice.call(arguments);
        args.splice(0, 1);

        // Declared array here because at initial core creation the $.network.X does not exist.
        $.each([$.network.ajax, $.network.eventsource, $.network.mask, $.network.websocket], function () {
            this[methodName].apply(this, args);
        });
    },
    isConnecting = false,
    isDisconnecting = false,
    connectScheduled = false,
    disconnectScheduled = false,
    network = {
        enable: function () {
            /// <summary>Enables the network mock functionality.</summary>
            invoke("enable");
        },
        disable: function () {
            /// <summary>Disables the network mock functionality.</summary>
            invoke("disable");
        },
        disconnect: function (soft) {
            /// <summary>Disconnects the network so javascript transport methods are unable to communicate with a server.</summary>
            /// <param name="soft" type="Boolean">Whether the disconnect should be soft.  A soft disconnect indicates that transport methods are not notified of disconnect.</param>
            if (!isConnecting) {
                isDisconnecting = true;
                invoke("disconnect", soft);
                isDisconnecting = false;

                if (connectScheduled) {
                    connectScheduled = false;
                    network.connect();
                }
            } else {
                disconnectScheduled = true;
            }
        },
        connect: function () {
            /// <summary>Connects the network so javascript methods can continue utilizing the network.</summary>
            if (!isDisconnecting) {
                isConnecting = true;
                invoke("connect");
                isConnecting = false;

                if (disconnectScheduled) {
                    disconnectScheduled = false;
                    network.disconnect();
                }
            } else {
                connectScheduled = true;
            }
        }
    };

    $.network = network;
})($, window);
