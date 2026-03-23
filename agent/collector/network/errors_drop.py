
# here we will have our error or drop collector, drop means if some packet is dropped 
# following calculated vlaues are in per second, 
# calculate the difference in error and drop counts between two consecutive calls,
# then divide by the time difference to get rates per second.

import psutil
import time

# previous state
_prev_errin = None
_prev_errout = None
_prev_dropin = None
_prev_dropout = None
_prev_timestamp = None


def error_drop_rates_per_second():
    global _prev_errin, _prev_errout, _prev_dropin, _prev_dropout, _prev_timestamp

    net = psutil.net_io_counters()
    current_time = time.time()

    # first run
    if _prev_timestamp is None:
        _prev_errin = net.errin
        _prev_errout = net.errout
        _prev_dropin = net.dropin
        _prev_dropout = net.dropout
        _prev_timestamp = current_time

        return {
            "packet_errors_in_per_sec": None,
            "packet_errors_out_per_sec": None,
            "packet_drops_in_per_sec": None,
            "packet_drops_out_per_sec": None,
        }

    time_diff = current_time - _prev_timestamp

    # compute differences
    diff_errin = net.errin - _prev_errin
    diff_errout = net.errout - _prev_errout
    diff_dropin = net.dropin - _prev_dropin
    diff_dropout = net.dropout - _prev_dropout

    # update prev values
    _prev_errin = net.errin
    _prev_errout = net.errout
    _prev_dropin = net.dropin
    _prev_dropout = net.dropout
    _prev_timestamp = current_time

    if time_diff <= 0:
        return None

    def safe_rate(diff):
        return None if diff < 0 else diff / time_diff

    return {
        "packet_errors_in_per_sec": safe_rate(diff_errin),
        "packet_errors_out_per_sec": safe_rate(diff_errout),
        "packet_drops_in_per_sec": safe_rate(diff_dropin),
        "packet_drops_out_per_sec": safe_rate(diff_dropout),
        "total_error_rate" : None,
        "error_per_sec" : None,
        "total_drop_rate" : None,
        "drop_per_sec" : None
    }

def aggregate_error_drop_rates(rates):
    """
    Aggregate total error and drop rates from per-second metrics.
    """

    err_in = rates.get("packet_errors_in_per_sec")
    err_out = rates.get("packet_errors_out_per_sec")
    drop_in = rates.get("packet_drops_in_per_sec")
    drop_out = rates.get("packet_drops_out_per_sec")

    def safe_sum(a, b):
        if a is None or b is None:
            return None
        return a + b

    error_rate = safe_sum(err_in, err_out)
    drop_rate = safe_sum(drop_in, drop_out)

    return {
        "error_rate": error_rate,
        "drop_rate": drop_rate
    }


async def collect_network_errors(event_bus):
 
    rates = error_drop_rates_per_second()
    aggregates = aggregate_error_drop_rates(rates)

    event = {
        "timestamp": time.time(),
        "type": "network_error_metrics",
        "data": {
            **rates,
            **aggregates
        }
    }

    print("Network Error Data collected : ", event)

    await event_bus.publish(event)