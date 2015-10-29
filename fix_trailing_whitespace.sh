# Strips trailing whitespace from your files

declare -a add_commands

old_IFS=$IFS
IFS='
'
add_commands="$(git add -A -n)"
# changed_files="$(git -A -n)"

for k in ${add_commands[@]}; do
  fname="${k##add \'}"
  fname="${fname%%\'}"
  changed_files="${changed_files[@]} ${fname}"
done
IFS=$old_IFS

for fname in ${changed_files[@]}; do
  if [[ ! -z "$(grep '\s\+$' ${fname})" ]]; then
    echo "Stripping trailing whitespace from ${fname}"
    sed -i 's/[ \t]\+$//' "${fname}"
  fi
done

echo "Please check your code again to verify that it still works"
