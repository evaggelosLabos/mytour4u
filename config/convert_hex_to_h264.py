input_file = r"C:\Users\egw\Desktop\video_payload.txt"
output_file = r"C:\Users\egw\Desktop\output_video.h264"

with open(input_file, 'r', encoding='utf-8', errors='ignore') as infile, open(output_file, 'wb') as outfile:
    for line in infile:
        try:
            data = bytes.fromhex(line.strip())
            outfile.write(data)
        except ValueError:
            continue


