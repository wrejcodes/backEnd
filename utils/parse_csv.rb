require 'csv'

filename = 'tox.csv'
counter = 0

headers = []
fields = []
combined = []

def get_type(string)
  return "bool" if string == "FALSE" or string == "TRUE" 
  return "null" if string == "NA" or string == "null"
  return "int" if string =~ /\A[-+]?\d+\z/ 
  return "float" if string =~ /[+-]?([0-9]*[.])?[0-9]+/ 
  return "string"
end

CSV.foreach(filename) do |row|
  row_index = 0
  row.each do |item|
    headers.push item if counter == 0
    type = get_type(item)
    fields.push type if counter == 1
    if counter > 1 
      type = get_type(item) if fields[row_index] == "null"
      fields[row_index] = type if type != "null"
    end
    row_index += 1
  end
  counter += 1

end

fields.each_with_index do |field, index|
  fields[index] = "string" if field == "null"
end

fields.each_with_index do |field, index|
  combined.push "#{headers[index]}:#{field}"
end

combined_string = combined.join(", \n")


File.open("#{filename.split('.')[0]}.txt", 'w') do |file|
  file.write(combined_string)
end

