from datetime import datetime, timedelta
import csv
import re

# 起始日期和结束日期
start_date = datetime(2017, 2, 23)
end_date = datetime(2017, 4, 26)

# 使用循环遍历日期范围
current_date = start_date
while current_date <= end_date:
    data = []
    date = current_date.strftime('%Y%m%d')
    date1 = current_date.strftime('%Y-%m-%d')
    print(date)
    with open("data/" + date + ".csv", newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        line = 1
        for row in reader:
            if line != 1:
                item = {'md5': row[0], 'content': re.sub(r'[\x00-\x1F\x7F]', '', row[1].strip()).replace('"', '\'').replace('\\', ''),
                        'dial': row[2], 'connect': row[3], 'receive': row[4],
                        'E': row[5], 'N': row[6]}
                data.append(item)
            line += 1
    with open("javascript/" + date1 + '.json', mode='w', encoding='utf-8') as f:
        f.write('{\n\t"type": "FeatureCollection",\n\t"features": [\n')
        for i in range(0, len(data)):
            item = data[i]
            f.write('\t\t{"type":"Feature",\n\t\t"geometry": {"type":"Point","coordinates":[')
            f.write(item['E'] + ',' + item['N'] + ']},\n\t\t"properties":{"name":"')
            f.write(item['content'] + '","value":"' + item['md5'] + '","time":' + date + '}\n')
            f.write('\t\t}')
            if i == len(data) - 1:
                f.write('\n')
            else:
                f.write(',\n')
        f.write('\t]\n}\n')
    current_date += timedelta(days=1)  # 日期加一天
