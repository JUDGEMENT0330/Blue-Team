import sys
import subprocess
import json
import xml.etree.ElementTree as ET

def parse_nmap_xml(xml_output):
    """Parses Nmap XML output and returns a structured dictionary."""
    root = ET.fromstring(xml_output)
    results = {
        "host": {
            "ip": root.find(".//address[@addrtype='ipv4']").get("addr"),
            "hostname": root.find(".//hostname").get("name") if root.find(".//hostname") is not None else "",
            "status": root.find(".//status").get("state"),
        },
        "ports": []
    }

    for port in root.findall(".//port"):
        port_info = {
            "port_id": port.get("portid"),
            "protocol": port.get("protocol"),
            "state": port.find("state").get("state"),
            "service": port.find("service").get("name") if port.find("service") is not None else "unknown",
            "product": port.find("service").get("product") if port.find("service") is not None else "",
            "version": port.find("service").get("version") if port.find("service") is not None else "",
        }
        results["ports"].append(port_info)

    return results

def run_scan(target, scan_type):
    """Runs an Nmap scan and returns the parsed JSON output."""
    scan_args = {
        "fast": ["-T4", "-F"],
        "aggressive": ["-A"],
        "port-scan": ["-p-"],
    }

    if scan_type not in scan_args:
        raise ValueError("Invalid scan type specified.")

    command = ["nmap", *scan_args[scan_type], "-oX", "-", target]

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True
        )
        parsed_data = parse_nmap_xml(result.stdout)
        print(json.dumps(parsed_data, indent=2))
    except subprocess.CalledProcessError as e:
        print(json.dumps({"error": "Nmap scan failed", "details": e.stderr}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": "An unexpected error occurred", "details": str(e)}), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: python nmap_scanner.py <target> <scan_type>"}), file=sys.stderr)
        sys.exit(1)

    target_host = sys.argv[1]
    scan_profile = sys.argv[2]

    run_scan(target_host, scan_profile)
