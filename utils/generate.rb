generator_type = ARGV[0]

UNIT_TEST = 'unit_test'
ROUTE = 'route'
INTEGRATION_TEST = 'integration_test'

supported_types = [ROUTE, UNIT_TEST]

unless supported_types.include? generator_type
  puts "This type of generator is not supported"
  exit 
end

model_name = ARGV[1]

def get_path type
  return './test/unit/' if type == UNIT_TEST
  return './routes/'    if type == ROUTE
end

def test? type
  return type == UNIT_TEST || type == INTEGRATION_TEST
end

template_string = File.read("./utils/templates/#{generator_type}.template")

file_string = template_string.gsub("$TEMPLATE$", model_name)

path = get_path generator_type
is_test = test? generator_type

File.write("#{path}#{model_name}#{is_test ? ".test" : ""}.js", file_string)
